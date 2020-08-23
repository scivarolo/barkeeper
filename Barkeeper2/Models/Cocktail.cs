using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barkeeper2.Models {
	public class Cocktail {
		public int Id { get; set; }

		public string Name { get; set; }

		public string Instructions { get; set; }

		public string Notes { get; set; }

		public string CreatedById { get; set; }

		[ForeignKey ("CreatedById")]
		public ApplicationUser CreatedBy { get; set; }

		public DateTime CreatedDate { get; set; }

		public ICollection<CocktailIngredient> CocktailIngredients { get; set; }

	}
}