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
    [Route("api/v2/ingredients")]
    public class IngredientsController : ControllerBase
    {

        private readonly IIngredientsService _ingredientsService;


        public IngredientsController(IIngredientsService ingredientsService)
        {
            _ingredientsService = ingredientsService;
        }

        #region Get Ingredients
        [HttpGet]
        public async Task<ICollection<Ingredient>> GetIngredients()
        {
            var model = await _ingredientsService.GetAll();
            return model;
        }

        [HttpGet("{id}")]
        public async Task<Ingredient> GetIngredient(int id)
        {
            var model = await _ingredientsService.GetById(id);
            return model;
        }

        #endregion

        #region Save Ingredients

        [HttpPost]
        public async Task<Ingredient> AddNewIngredient(Ingredient newIngredient)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            newIngredient.CreatedById = userId;
            var model = await _ingredientsService.AddNew(newIngredient);
            return model;
        }

        [HttpPut("{id}")]
		public async Task<Ingredient> UpdateIngredient(Ingredient updatedIngredient, int id) {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var model = await _ingredientsService.Update(updatedIngredient, id, userId);
            return model;
        }

#endregion

		[HttpDelete("{id}")]
		public async Task<int> DeleteIngredient(Ingredient ingredient) {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return await _ingredientsService.Delete(ingredient, userId);
        }

	}
}