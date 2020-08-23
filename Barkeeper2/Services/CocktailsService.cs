using Barkeeper2.Interfaces;
using Barkeeper2.Models;
using Barkeeper2.Repositories;

namespace Barkeeper2.Services {
	public class CocktailsService : BaseService<Cocktail>, ICocktailsService {
		private readonly ICocktailsRepository _cocktailsRepository;

		public CocktailsService (ICocktailsRepository cocktailsRepository) : base (cocktailsRepository) {
			_cocktailsRepository = cocktailsRepository;
		}
	}
}