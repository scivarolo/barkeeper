using Barkeeper2.Data;
using Barkeeper2.Interfaces;
using Barkeeper2.Models;

namespace Barkeeper2.Repositories {
	public class CocktailIngredientsRepository : BaseRepository<CocktailIngredient>, ICocktailIngredientsRepository {
		private readonly ApplicationDbContext _context;

		public CocktailIngredientsRepository (ApplicationDbContext context) : base (context) {
			_context = context;
		}
	}
}