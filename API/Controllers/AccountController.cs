using API.DTO;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController: BaseApiController
    {

        private readonly ITokenService _tokenService;

         private readonly IMapper _mapper;

        private readonly UserManager<AppUser> _userManager;

        public AccountController(UserManager<AppUser> userManager,ITokenService tokenService, IMapper mapper)
        {
            _userManager = userManager;

            _tokenService = tokenService;
            _mapper = mapper;
        }
        [HttpPost("register")] //this is a POST method: api/account/register.
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await UserExists(registerDto.Username)) return BadRequest("name already exists");

            var user = _mapper.Map<AppUser>(registerDto);
            //if any class uses Idisposable method then they have to use dispose(). so we are using "using".
        
                user.UserName =  registerDto.Username.ToLower();


            //this will add save the users into our database.
            //usermanager will set the password
            //previously we used to add user only now its user and registerDto.password
           var result = await _userManager.CreateAsync(user, registerDto.Password);

           if(!result.Succeeded) return BadRequest(result.Errors);

           var roleResult = await _userManager.AddToRoleAsync(user, "Member");

           if(!roleResult.Succeeded) return BadRequest(result.Errors);

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnownAs= user.KnownAs,
                Gender = user.Gender
               
            };
        }

        [HttpPost("Login")]

        public async Task<ActionResult<UserDto>>Login(LoginDto loginDto)
        {
            //singleordefault will return only element of the input or else it will retwun default value if empty.
            var user = await _userManager.Users
            //entity framework is not going to load related entity
            //photo is a related entity
            //we need load it eagerly
            .Include(p=>p.Photos)
            .SingleOrDefaultAsync(x=>
            x.UserName == loginDto.UserName);

            if(user==null) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if(!result) return Unauthorized("Invalid pssword");
            return new UserDto
            {
                Username = user.UserName,
                Token =  await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x=> x.IsMain)?.Url,
                KnownAs=user.KnownAs,
                Gender = user.Gender
            };
        }
        //to check if username already exists in table.
        private async Task<bool> UserExists(string username)
        {
            //islower is used to convert user entered name to lower. we have to take input in lowercase aswell.
           return await _userManager.Users.AnyAsync(x=>x.UserName==username.ToLower());
        }
    }
}