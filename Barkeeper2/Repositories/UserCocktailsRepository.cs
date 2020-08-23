using Barkeeper2.Data;
using Barkeeper2.Interfaces;
using Barkeeper2.Models;

namespace Barkeeper2.Repositories {
	public class UserCocktailsRepository : BaseRepository<UserCocktail>, IUserCocktailsRepository {
		private readonly ApplicationDbContext _context;

		public UserCocktailsRepository (ApplicationDbContext context) : base (context) {
			_context = context;
		}
	}
}