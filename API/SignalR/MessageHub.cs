//Add this in program.cs

using API.DTO;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class MessageHub: Hub
    {
        private readonly IMessageRepository _messageRepository;
         private readonly IUserRepository _userRepository;
         private readonly IMapper _mapper;
        public MessageHub(IMessageRepository messageRepository, IUserRepository userRepository, IMapper mapper)
        {
            _messageRepository = messageRepository;
            _userRepository = userRepository;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"];
            var groupName = GetGroupName(Context.User.GetUsername(), otherUser);

            //group is added to signalR group here
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await AddToGroup(groupName);


            var messages = await
             _messageRepository.GetMessageThread(Context.User.GetUsername(), otherUser);

             await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);

        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await RemoveFromMessageGroup();
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
             var username = Context.User.GetUsername();

            if(username == createMessageDto.RecipientUsername.ToLower())
            //we cannot pass bad request back so we need to use throw
                throw new HubException("you cannot send message yourself");


            var sender = await _userRepository.GetUserByUserNameAsync(username);
            var recipient = await _userRepository.GetUserByUserNameAsync(createMessageDto.RecipientUsername);

            if(recipient==null) throw new HubException("Not fund user");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername= recipient.UserName,
                Content = createMessageDto.Content
            };
            
            var groupName = GetGroupName(sender.UserName, recipient.UserName);

            var group = await _messageRepository.GetMessageGroup(groupName);

            if(group.Connections.Any(x=> x.Username == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }

            _messageRepository.AddMessage(message); //inside message repository

            if(await _messageRepository.SaveAllAsync())
            {
                await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));//same should be used while sending message in client side
            }

        }

        //arrange in alphabetical order
        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other)<0; // making this return boolean instead of string
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";

        }

        private async Task<bool> AddToGroup(string groupName)
            {
                var group = await _messageRepository.GetMessageGroup(groupName);
                var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());

                if(group == null)
                {
                    group = new Group(groupName);
                    _messageRepository.AddGroup(group);
                }
                group.Connections.Add(connection);

                return await _messageRepository.SaveAllAsync();
            }


    //we are only removing connection from database. we are removing them from message group in signalR
        private async Task RemoveFromMessageGroup()
        {
            var connection = await _messageRepository.GetConnection(Context.ConnectionId);
            _messageRepository.RemoveConnection(connection);

            await _messageRepository.SaveAllAsync();
        }


    }
}