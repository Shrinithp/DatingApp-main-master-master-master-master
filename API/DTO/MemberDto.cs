using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class MemberDto
    {
        public int Id{get; set;}

        public string UserName{get; set;}
        //photourl is used because we need to populate url of photo here
        public string PhotoUrl { get; set; }

        public int  Age { get; set; }

        public string KnownAs { get; set; }


        // UTC is a universal format to represent date and time as an alternative to local time
        //GMT time
        public DateTime Created {get;set;} = DateTime.UtcNow;

        public DateTime LastActive {get; set;}

        public string Introduction { get; set; }

        public string LookingFor {get;set;}

        public string Interests { get; set; }

        public string City {get;set;}

        public string Country {get;set;}

        public List<PhotoDto> Photos{ get; set; }

    }
}