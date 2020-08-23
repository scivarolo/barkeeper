using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barkeeper2.Models {
	public class CocktailIngredient {
		public int Id { get; set; }

		public int CocktailId { get; set; }

		public Cocktail Cocktail { get; set; }

		public int IngredientId { get; set; }

		public Ingredient Ingredient { get; set; }
	}
}