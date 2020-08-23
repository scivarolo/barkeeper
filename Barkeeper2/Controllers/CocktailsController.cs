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
	[Route("api/v2/cocktails")]
	public class CocktailsController : ControllerBase {

        private readonly ICocktailsService _cocktailsService;

		public CocktailsController(ICocktailsService cocktailsService) {
            _cocktailsService = cocktailsService;
        }

		[HttpGet]
		public async Task<ICollection<Cocktail>> GetCocktails() {
            var model = await _cocktailsService.GetAll();
            return model;
        }

		[HttpGet("{id}")]
		public async Task<Cocktail> GetCocktail(int id) {
            var model = await _cocktailsService.GetById(id);
            return model;
        }

		[HttpPost]
		public async Task<Cocktail> AddNewCocktail(Cocktail newCocktail) {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            newCocktail.CreatedById = userId;
            var model = await _cocktailsService.AddNew(newCocktail);
            return model;
        }

		[HttpPut("{id}")]
		public async Task<Cocktail> UpdateCocktail(Cocktail updatedCocktail, int id) {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var model = await _cocktailsService.Update(updatedCocktail, id, userId);
            return model;
        }

		[HttpDelete("{id}")]
		public async Task<int> DeleteCocktail(Cocktail cocktail) {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return await _cocktailsService.Delete(cocktail, userId);
        }
    }
}