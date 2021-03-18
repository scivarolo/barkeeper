using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barkeeper2.Models {
	public class Product {
		[Key]
		public int Id { get; set; }

		[Required]
		public string Name { get; set; }

		[Required]
		public int IngredientId { get; set; }

		[ForeignKey("IngredientId")]
		public Ingredient Ingredient { get; set; }

		public string CreatedById { get; set; }

		public DateTime CreatedDate { get; set; }
	}
}