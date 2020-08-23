using Barkeeper2.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Barkeeper2.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }

		public DbSet<Ingredient> Ingredients { get; set; }

		public DbSet<Cocktail> Cocktails { get; set; }

		public DbSet<Product> Products { get; set; }

		public DbSet<CocktailIngredient> CocktailIngredients { get; set; }

		public DbSet<UserCocktail> UserCocktails { get; set; }

		public DbSet<UserHistory> UserHistories { get; set; }

		public DbSet<UserProduct> UserProducts { get; set; }

		public DbSet<UserShopping> UserShopping { get; set; }

		public DbSet<UserTabCocktail> UserTabCocktails { get; set; }
    }
}
