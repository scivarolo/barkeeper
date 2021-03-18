using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Barkeeper2.Models {
	public class Ingredient {
		[Key]
		public int Id { get; set; }

		[Required]
		public bool Liquid { get; set; }

		[Required]
		public string Name { get; set; }

		//public virtual ICollection<CocktailIngredient> CocktailIngredients { get; set; }

		public string CreatedById { get; set; }

		//[ForeignKey ("CreatedById")]
		//public ApplicationUser CreatedBy { get; set; }

		public DateTime CreatedDate { get; set; }

		public ICollection<Product> Products { get; set; }
	}
}