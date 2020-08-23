using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Barkeeper2.Interfaces;
using Barkeeper2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Barkeeper2.Controllers {
    [Authorize]
    [Route("api/v2/usercocktails")]
    public class UserCocktailsController : ControllerBase
    {

        private readonly IUserCocktailsService _userCocktailsService;

        public UserCocktailsController(IUserCocktailsService userCocktailsService)
        {
            _userCocktailsService = userCocktailsService;
        }

        [HttpGet]
        public async Task<ICollection<UserCocktail>> GetUserCocktails()
        {
            var model = await _userCocktailsService.GetAll();
            return model;
        }

        [HttpGet("{id}")]
        public async Task<UserCocktail> GetUserCocktail(int id)
        {
            var model = await _userCocktailsService.GetById(id);
            return model;
        }

        [HttpPost]
        public async Task<UserCocktail> AddNewUserCocktail(UserCocktail newUserCocktail) {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            newUserCocktail.UserId = userId;
            var model = await _userCocktailsService.AddNew(newUserCocktail);
            return model;
        }

        [HttpPut("{id}")]
        public async Task<UserCocktail> UpdateUserCocktail(UserCocktail updatedUserCocktail, int id) {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var model = await _userCocktailsService.Update(updatedUserCocktail, id, userId);
            return model;
        }

        [HttpDelete("{id}")]
        public async Task<int> DeleteUserCocktail(UserCocktail userCocktail) {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return await _userCocktailsService.Delete(userCocktail, userId);
        }


    }
}