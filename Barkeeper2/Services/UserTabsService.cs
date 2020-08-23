using Barkeeper2.Interfaces;
using Barkeeper2.Models;
using Barkeeper2.Repositories;

namespace Barkeeper2.Services {
	public class UserTabsService : BaseService<UserTabCocktail>, IUserTabsService {
		private readonly IUserTabsRepository _userTabsRepository;

		public UserTabsService (IUserTabsRepository userTabsRepository) : base (userTabsRepository) {
			_userTabsRepository = userTabsRepository;
		}
	}
}