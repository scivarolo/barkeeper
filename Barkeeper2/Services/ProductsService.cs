using Barkeeper2.Interfaces;
using Barkeeper2.Models;
using Barkeeper2.Repositories;

namespace Barkeeper2.Services {
	public class ProductsService : BaseService<Product>, IProductsService {
		private readonly IProductsRepository _productsRepository;

		public ProductsService (IProductsRepository productsRepository) : base (productsRepository) {
			_productsRepository = productsRepository;
		}
	}
}