using Barkeeper2.Interfaces;
using Barkeeper2.Models;
using Barkeeper2.Repositories;

namespace Barkeeper2.Services {
	public class UserShoppingService : BaseService<UserShopping>, IUserShoppingService {
		private readonly IUserShoppingRepository _userShoppingRepository;

		public UserShoppingService (IUserShoppingRepository userShoppingRepository) : base (userShoppingRepository) {
			_userShoppingRepository = userShoppingRepository;
		}
	}
}