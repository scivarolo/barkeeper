using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barkeeper2.Models {
	public class UserTabCocktail {
		public int Id { get; set; }

		public int CocktailId { get; set; }

		public Cocktail Cocktail { get; set; }

		public string UserId { get; set; }

		public DateTime DateAdded { get; set; }
	}
}