using Barkeeper2.Interfaces;
using Barkeeper2.Models;
using Barkeeper2.Repositories;

namespace Barkeeper2.Services {
	public class UserProductsService : BaseService<UserProduct>, IUserProductsService {
		private readonly IUserProductsRepository _userProductsRepository;

		public UserProductsService (IUserProductsRepository userProductsRepository) : base (userProductsRepository) {
			_userProductsRepository = userProductsRepository;
		}
	}
}