using Barkeeper2.Data;
using Barkeeper2.Interfaces;
using Barkeeper2.Models;

namespace Barkeeper2.Repositories {
	public class UserShoppingRepository : BaseRepository<UserShopping>, IUserShoppingRepository {
		private readonly ApplicationDbContext _context;

		public UserShoppingRepository (ApplicationDbContext context) : base (context) {
			_context = context;
		}
	}
}