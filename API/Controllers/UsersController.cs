using API.DTO;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers

{
    [Authorize]
    public class UsersController: BaseApiController//baseapi is my base class.I'm deriving controllers from that class
    {
        public readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;

        }

        [HttpGet]
        //code is made async to perfrom multiple tasks. if we use sync code and our database is huge
        //if server gets multiple requests then it will try to complete single task. in order to avoid that single request async code is used.

        public async Task<ActionResult<IEnumerable<MemberDto>>>GetUsers([FromQuery]UserParams userParams)
        {

            //intially user name is taken inorder to get his gender.
            var currentUser = await _userRepository.GetUserByUserNameAsync(User.GetUsername());
            userParams.CurrentUsername=currentUser.UserName;

            // if(string.IsNullOrEmpty(userParams.Gender))
            // {
            //     userParams.Gender = currentUser.Gender == "male"? "female" : "male";
            // }
             var users = await _userRepository.GetMembersAsync(userParams);

             Response.AddPaginationHeader(new PaginationHeader(users.TotalPages,users.PageSize,users.CurrentPage, 
            users.TotalCount));
             
            return Ok(users);
        }

        [HttpGet("{username}")]
        //since we are returning single user so we dont use IEnumerable


        // GetUser method is expected to handle a HTTP GET request to retrieve user information based on the specified username.
        //  The ActionResult<MemberDto> used to return different HTTP responses, such as Ok, NotFound, BadRequest.
        //   along with the appropriate MemberDto data in the response body
        public async Task<ActionResult<MemberDto>>GetUser(string username)
        {
            //after cleaning 
            return await _userRepository.GetMemberAsync(username);
            
            
        }
//we need to alter the existing data that is why put
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            // var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            //GetUsername is taken from claims

            var user = await _userRepository.GetUserByUserNameAsync(User.GetUsername());


            if(user==null) return NotFound();

            _mapper.Map(memberUpdateDto, user);//this line of code updates all of the properties

            if(await _userRepository.SaveAllSync()) return NoContent();
            return BadRequest("failed to update user");
        }
        //add-photo is root parameter


//we need to create new data that is why post
        [HttpPut]
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUsername());
            if(user==null) return NotFound();

            var result = await _photoService.AddPhotoAsync(file);

            if(result.Error!=null) return BadRequest(result.Error.Message);

            var photo = new Photo{
                Url = result.SecureUrl.AbsoluteUri,
                //id is stored inside publicid(photo.cs)
                PublicId = result.PublicId
            };

            if(user.Photos.Count == 0) photo.IsMain = true;
            user.Photos.Add(photo);

            if(await _userRepository.SaveAllSync()) 
            //return loaction where image is stored
            // http://localhost:5001/api/Users/lisa
            return CreatedAtAction(nameof(GetUser), new{username = user.UserName}, _mapper.Map<PhotoDto>(photo));
            return BadRequest("problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]

        public async Task<ActionResult> setMainPhoto(int photoId){
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUsername());
            if(user==null) return NotFound();

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if(photo == null) return NotFound();

            if(photo.IsMain) return BadRequest("this is already your main photo");

            var currentMain = user.Photos.FirstOrDefault(x=>x.IsMain);
            if(currentMain!=null) currentMain.IsMain = false;
            photo.IsMain = true;

            if(await _userRepository.SaveAllSync()) return NoContent();
            return BadRequest("problem seting the main photo");


        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(x=>x.Id==photoId);

            if(photo==null) return NotFound();

            if(photo.IsMain) return BadRequest("you cannot dlete your main photo");
    //photos that are seeded
            if(photo.PublicId!=null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error !=null) return BadRequest(result.Error.Message);

            }
            user.Photos.Remove(photo);

            if(await _userRepository.SaveAllSync()) return Ok();

            return BadRequest("problem deleting the photo");
        }
    }
}