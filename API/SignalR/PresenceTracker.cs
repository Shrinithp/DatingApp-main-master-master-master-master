//Add this in applicationservice extensions its a singleton
//inject this inside presencehub


namespace API.SignalR
{
    public class PresenceTracker
    {
        //username is the key ad conection id is the value, since user may loggin
        //with different devices and can create multiple id's
        private static readonly Dictionary<string, List<string>> OnlineUsers =
         new Dictionary<string, List<string>>();

         public Task UserConnected(string username, string connectionId)
         {
            lock(OnlineUsers)
            {
                //if user is already logged in using other device then add connectionId
                if(OnlineUsers.ContainsKey(username))
                {
                    OnlineUsers[username].Add(connectionId);
                }
                else{
                    OnlineUsers.Add(username, new List<string>{connectionId});
                }
            }
            return Task.CompletedTask;
         }

         public Task UserDisconnected(string username, string connectionId)
         {
            lock(OnlineUsers)
            {
                if(!OnlineUsers.ContainsKey(username)) return Task.CompletedTask;

                OnlineUsers[username].Remove(connectionId);

                if(OnlineUsers[username].Count ==0) 
                {
                    OnlineUsers.Remove(username);
                }

            }
            return Task.CompletedTask;
         }


         //method to get who is only
         public Task<string[]> GetOnlineUsers()
         {
            string[] onlineUsers;
            lock(OnlineUsers)
            {
                onlineUsers = OnlineUsers.OrderBy(k=>k.Key).Select(k=>k.Key).ToArray();
            }

            return Task.FromResult(onlineUsers);
         }
    }
}