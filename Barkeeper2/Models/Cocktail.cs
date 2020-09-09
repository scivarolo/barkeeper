using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barkeeper2.Models {
	public class Cocktail {
		public int Id { get; set; }

		[Required]
		public string Name { get; set; }

		[Required]
		public string Instructions { get; set; }

		public string Notes { get; set; }

		public string CreatedById { get; set; }

		public DateTime CreatedDate { get; set; }

		[Required]
		public ICollection<CocktailIngredient> CocktailIngredients { get; set; }

	}
}