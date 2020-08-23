using Barkeeper2.Data;
using Barkeeper2.Interfaces;
using Barkeeper2.Models;

namespace Barkeeper2.Repositories {
	public class UserTabsRepository : BaseRepository<UserTabCocktail>, IUserTabsRepository {
		private readonly ApplicationDbContext _context;

		public UserTabsRepository (ApplicationDbContext context) : base (context) {
			_context = context;
		}
	}
}