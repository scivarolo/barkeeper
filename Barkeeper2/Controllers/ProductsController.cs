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
    [Route("api/v1/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductsService productsService;

        public ProductsController(IProductsService ProductsService)
        {
            productsService = ProductsService;
        }

        [HttpGet]
        public async Task<ICollection<Product>> GetProducts()
        {
            var model = await productsService.GetAll();
            return model;
        }

        [HttpGet("{id}")]
        public async Task<Product> GetProduct(int id)
        {
            var model = await productsService.GetById(id);
            return model;
        }

        [HttpPost]
        public async Task<Product> AddNewProduct(Product product)
        {
            var model = await productsService.AddNew(product);
            return model;
        }

        // [HttpPut("{id}")]
        // public async Task<CocktailIngredient> UpdateCocktailIngredient(CocktailIngredient updatedCocktailIngredient, int id) {
        //     var model = await productsService.Update(updatedCocktailIngredient, id);
        //     return model;
        // }
	}
}