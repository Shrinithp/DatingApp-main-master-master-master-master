using API.Extensions;

namespace API.Entities
{
    public class AppUser
    {
        //use the same convention as ID because entity framework is based on convention based.
        //if i give theId instead ID then have say that externally that theID is a key.
        //[key] should be written if we use other name,
        public int Id{get; set;}

        public string UserName{get; set;}

        public byte[] PasswordHash{get; set;}

        public byte[] PasswordSalt{get; set;}

       public string Gender { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public string KnownAs { get; set; }


        // UTC is a universal format to represent date and time as an alternative to local time
        //GMT time
        public DateTime Created {get;set;} = DateTime.UtcNow;

        public DateTime LastActive {get; set;}= DateTime.UtcNow;

        public string Introduction { get; set; }

        public string LookingFor {get;set;}

        public string Interests { get; set; }

        public string City {get;set;}

        public string Country {get;set;}

        public List<Photo> Photos{ get; set; } = new();

        public List<UserLike> LikedByUsers{get;set;}

        public List<UserLike> LikedUsers{get;set;}
        


    







    }
}