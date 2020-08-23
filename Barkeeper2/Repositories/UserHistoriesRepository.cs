using Barkeeper2.Data;
using Barkeeper2.Interfaces;
using Barkeeper2.Models;

namespace Barkeeper2.Repositories {
	public class UserHistoriesRepository : BaseRepository<UserHistory>, IUserHistoriesRepository {
		private readonly ApplicationDbContext _context;

		public UserHistoriesRepository (ApplicationDbContext context) : base (context) {
			_context = context;
		}
	}
}