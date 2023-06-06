using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController:BaseApiController
    {
        private readonly DataContext _context;
        public BuggyController(DataContext context)
        {
            _context = context;
        }
        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return "secret text";        
        }
        // It attempts to find a user in the _context.Users collection using a non-existent ID (-1). 
        // If the user is not found it returns a 404 Not Found response using the NotFound()
         [HttpGet("not-found")]
        public ActionResult<AppUser>GetNotFound()
        {
            var thing = _context.Users.Find(-1);//attempt to find a user that doesnot exist
            if(thing==null) return NotFound();
            return thing;        
        }

        // When the frontend application makes a request to this endpoint,
        //  the API will return an HTTP response with a status code of 500 (Internal Server Error)
        //  along with the error message associated with the exception


         [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            var thing = _context.Users.Find(-1); 
            var thingToReturn = thing.ToString();//null exception error

            return thingToReturn;
        }


         [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("this was not a good request");        
        }

    }
}