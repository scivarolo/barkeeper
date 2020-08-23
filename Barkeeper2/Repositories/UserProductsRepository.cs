using Barkeeper2.Data;
using Barkeeper2.Interfaces;
using Barkeeper2.Models;

namespace Barkeeper2.Repositories {
	public class UserProductsRepository : BaseRepository<UserProduct>, IUserProductsRepository {
		private readonly ApplicationDbContext _context;

		public UserProductsRepository (ApplicationDbContext context) : base (context) {
			_context = context;
		}
	}
}