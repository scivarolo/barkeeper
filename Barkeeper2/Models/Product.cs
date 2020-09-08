using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barkeeper2.Models {
	public class Product {
		public int Id { get; set; }

		public string Name { get; set; }

		public int IngredientId { get; set; }

		public Ingredient Ingredient { get; set; }

		public string CreatedById { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public DateTime CreatedDate { get; set; }
	}
}