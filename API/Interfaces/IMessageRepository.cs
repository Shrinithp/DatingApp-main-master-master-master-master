using API.DTO;
using API.Entities;
using API.Helpers;
using Microsoft.AspNetCore.SignalR;

namespace API.Interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message); //first part

        void DeleteMessage(Message message);

        Task<Message> GetMessage (int id);

    //return pagelist of type MessageDto
        Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams); //second part

        Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string RecipientUserName); //third part

        Task<bool> SaveAllAsync();

        //This is for tracking of our group
        void AddGroup(Group group);

        void RemoveConnection(Connection connection);

        Task <Connection> GetConnection(string connectionId);
        Task <Group> GetMessageGroup(string groupName);

        
    }
}