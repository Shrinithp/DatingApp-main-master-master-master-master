using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Photos")]
    public class Photo
    {

        public int  Id { get; set; }
        public string Url{get;set;}
        public bool IsMain { get; set; }
        public string PublicId{get;set;}
        //all of the photos should be associated with the user so we are this code.

        public int AppUserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}