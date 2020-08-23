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
    [Route("api/v2/cocktailIngredients")]
    public class CocktailIngredientsController : ControllerBase
    {
        private readonly ICocktailIngredientsService _cocktailIngredientsService;

        public CocktailIngredientsController(ICocktailIngredientsService cocktailIngredientsService)
        {
            _cocktailIngredientsService = cocktailIngredientsService;
        }

        [HttpGet]
        public async Task<ICollection<CocktailIngredient>> GetCocktailIngredients()
        {
            var model = await _cocktailIngredientsService.GetAll();
            return model;
        }

        [HttpGet("{id}")]
        public async Task<CocktailIngredient> GetCocktailIngredient(int id)
        {
            var model = await _cocktailIngredientsService.GetById(id);
            return model;
        }

        [HttpPost]
        public async Task<CocktailIngredient> AddNewCocktailIngredient(CocktailIngredient newCocktailIngredient)
        {
            var model = await _cocktailIngredientsService.AddNew(newCocktailIngredient);
            return model;
        }

        // [HttpPut("{id}")]
        // public async Task<CocktailIngredient> UpdateCocktailIngredient(CocktailIngredient updatedCocktailIngredient, int id) {
        //     var model = await _cocktailIngredientsService.Update(updatedCocktailIngredient, id);
        //     return model;
        // }
	}
}