using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Barkeeper2.Data;
using Barkeeper2.GraphQL;
using Barkeeper2.Models;
using Barkeeper2.Interfaces;
using Barkeeper2.Repositories;
using Barkeeper2.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Barkeeper2.Helpers.Exceptions;
using Barkeeper2.GraphQL.Ingredients.DataLoaders;
using Barkeeper2.GraphQL.Ingredients;
using Barkeeper2.GraphQL.Products;

namespace Barkeeper2
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(Configuration["Barkeeper2:ConnectionString"])
            );
            services.AddPooledDbContextFactory<GraphQLDbContext>(options =>
                options.UseNpgsql(Configuration["Barkeeper2:ConnectionString"])
            );

            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddIdentityServer()
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

            services.AddAuthentication()
                .AddIdentityServerJwt();

            services.AddControllersWithViews();
            services.AddRazorPages();
            services.AddHttpContextAccessor();
            services
                .AddGraphQLServer()
                .AddQueryType(d => d.Name("Query"))
                    .AddTypeExtension<IngredientQueries>()
                    .AddTypeExtension<ProductQueries>()
                .AddMutationType(d => d.Name("Mutation"))
                    .AddTypeExtension<IngredientMutations>()
                .AddDataLoader<IngredientByIdDataLoader>();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            // Barkeeper2 Repositories DI
            services.AddScoped<ICocktailIngredientsRepository, CocktailIngredientsRepository>();
            services.AddScoped<ICocktailsRepository, CocktailsRepository>();
            services.AddScoped<IIngredientsRepository, IngredientsRepository>();
            services.AddScoped<IProductsRepository, ProductsRepository>();
            services.AddScoped<IUserCocktailsRepository, UserCocktailsRepository>();
            services.AddScoped<IUserHistoriesRepository, UserHistoriesRepository>();
            services.AddScoped<IUserProductsRepository, UserProductsRepository>();
            services.AddScoped<IUserShoppingRepository, UserShoppingRepository>();
            services.AddScoped<IUserTabsRepository, UserTabsRepository>();

            // Barkeeper2 Services DI
            services.AddScoped<ICocktailIngredientsService, CocktailIngredientsService>();
            services.AddScoped<ICocktailsService, CocktailsService>();
            services.AddScoped<IIngredientsService, IngredientsService>();
            services.AddScoped<IProductsService, ProductsService>();
            services.AddScoped<IUserCocktailsService, UserCocktailsService>();
            services.AddScoped<IUserHistoriesService, UserHistoriesService>();
            services.AddScoped<IUserProductsService, UserProductsService>();
            services.AddScoped<IUserShoppingService, UserShoppingService>();
            services.AddScoped<IUserTabsService, UserTabsService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseMiddleware<JsonExceptionHandler>();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGraphQL();
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
                if (env.IsDevelopment())
                {
                    // spa.UseReactDevelopmentServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                }
            });
        }
    }
}
