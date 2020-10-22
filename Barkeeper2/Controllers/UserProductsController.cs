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
    [Route("api/v1/userProducts")]
    public class UserProductsController : ControllerBase
    {
        private readonly IUserProductsService userProductsService;

        public UserProductsController(IUserProductsService UserProductsService)
        {
            userProductsService = UserProductsService;
        }

        [HttpGet]
        public async Task<ICollection<UserProduct>> GetProducts()
        {
            var model = await userProductsService.GetAll();
            return model;
        }

        [HttpGet("{id}")]
        public async Task<UserProduct> GetProduct(int id)
        {
            var model = await userProductsService.GetById(id);
            return model;
        }

        [HttpPost]
        public async Task<UserProduct> AddNewProduct(UserProduct userProduct)
        {
            var model = await userProductsService.AddNew(userProduct);
            return model;
        }

        // [HttpPut("{id}")]
        // public async Task<CocktailIngredient> UpdateCocktailIngredient(CocktailIngredient updatedCocktailIngredient, int id) {
        //     var model = await productsService.Update(updatedCocktailIngredient, id);
        //     return model;
        // }
	}
}