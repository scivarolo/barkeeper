using Barkeeper2.Models;
using Microsoft.EntityFrameworkCore;

namespace Barkeeper2.GraphQL
{
    public class GraphQLDbContext : DbContext
    {
        public GraphQLDbContext(DbContextOptions options) : base(options)
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
		public DbSet<Models.UserShopping> UserShopping { get; set; }
		public DbSet<UserTabCocktail> UserTabCocktails { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<UserCocktail>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(x => x.UserId);
            builder.Entity<UserHistory>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(x => x.UserId);
            builder.Entity<UserProduct>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(x => x.UserId);
            builder.Entity<Models.UserShopping>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(x => x.UserId);
            builder.Entity<UserTabCocktail>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(x => x.UserId);
            builder.Entity<Product>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(x => x.CreatedById);
            builder.Entity<Cocktail>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(x => x.CreatedById);
            builder.Entity<Ingredient>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(x => x.CreatedById);
            builder.Entity<Ingredient>()
                .Property(i => i.CreatedDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();
            builder.Entity<Cocktail>()
                .Property(c => c.CreatedDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();
            builder.Entity<Product>()
                .Property(p => p.CreatedDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();
            builder.Entity<UserCocktail>()
                .Property(c => c.DateAdded)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();
            builder.Entity<UserHistory>()
                .Property(h => h.Timestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();
            builder.Entity<UserProduct>()
                .Property(p => p.DateAdded)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();
            builder.Entity<Models.UserShopping>()
                .Property(s => s.DateAdded)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();
            builder.Entity<UserTabCocktail>()
                .Property(c => c.DateAdded)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();
        }
    }
}
