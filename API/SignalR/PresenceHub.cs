//Add services in applicationextension

//Add maphub inside program.cs

//signalR is not a http request to make onconnection. We need to use web sockets.
//goto identity service extensions.(after this needs to make changes in cors config aswell-programs.cs)


using API.Extensions;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class PresenceHub: Hub
    {
        private readonly PresenceTracker _tracker;
        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
            
        }


        //This method will create a new connectionId(PresenceTracker) inside dict and notify all users. then agian we getusers who are online
        public override async Task OnConnectedAsync()
        {
            //connectionId is from hubcaller.
            await _tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
            //tell other users that a user is connected(online)
            await Clients.Others.SendAsync("UserIsOnLine", Context.User.GetUsername()); //same should be inside presence service

            var currentUsers = await _tracker.GetOnlineUsers();
            await Clients.All.SendAsync("GetOnlineUsers", currentUsers); //same should be inside presence service
        }
        //This method will remove a new connectionId(PresenceTracker)  inside dict and notify all users. then agian we getusers who are online
        public override async Task OnDisconnectedAsync(Exception exception)
        {

             await _tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername()); //same should be inside presence service

            //exception is used so we are using base
            await base.OnDisconnectedAsync(exception);

            var currentUsers = await _tracker.GetOnlineUsers();
            await Clients.All.SendAsync("GetOnlineUsers", currentUsers); //same should be inside presence service
        }
    }
}