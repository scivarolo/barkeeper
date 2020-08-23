using Barkeeper2.Data;
using Barkeeper2.Interfaces;
using Barkeeper2.Models;

namespace Barkeeper2.Repositories {
	public class CocktailsRepository : BaseRepository<Cocktail>, ICocktailsRepository {
		private readonly ApplicationDbContext _context;

		public CocktailsRepository (ApplicationDbContext context) : base (context) {
			_context = context;
		}
	}
}