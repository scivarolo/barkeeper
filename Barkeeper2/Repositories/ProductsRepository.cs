using Barkeeper2.Data;
using Barkeeper2.Interfaces;
using Barkeeper2.Models;

namespace Barkeeper2.Repositories {

	public class ProductsRepository : BaseRepository<Product>, IProductsRepository {
		private readonly ApplicationDbContext _context;
		public ProductsRepository (ApplicationDbContext context) : base (context) {
			_context = context;
		}
	}
}