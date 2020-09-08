using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barkeeper2.Models {
	public class CocktailIngredient {

		public int Id { get; set; }

		[Required]
		public int CocktailId { get; set; }

		public Cocktail Cocktail { get; set; }

		[Required]
		public int IngredientId { get; set; }

		public Ingredient Ingredient { get; set; }

		[Required]
		public decimal Amount { get; set; }

		[Required]
		public int Units { get; set; }

		[Required]
		public bool IsRequired { get; set; }

		[Required]
		public int SortOrder { get; set; }
	}
}