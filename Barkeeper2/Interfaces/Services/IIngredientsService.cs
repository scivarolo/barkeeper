using System.Threading.Tasks;
using Barkeeper2.Models;

namespace Barkeeper2.Interfaces {
	public interface IIngredientsService : IBaseService<Ingredient> {
		Task<Ingredient> SaveNewIngredient(Ingredient ingredient);
	}
}