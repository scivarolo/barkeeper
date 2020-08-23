using Barkeeper2.Interfaces;
using Barkeeper2.Models;
using Barkeeper2.Repositories;

namespace Barkeeper2.Services {
	public class UserHistoriesService : BaseService<UserHistory>, IUserHistoriesService {
		private readonly IUserHistoriesRepository _userHistoriesRepository;

		public UserHistoriesService (IUserHistoriesRepository userHistoriesRepository) : base (userHistoriesRepository) {
			_userHistoriesRepository = userHistoriesRepository;
		}
	}
}