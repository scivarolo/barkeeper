using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barkeeper2.Models {
	public class UserProduct {
		public int Id { get; set; }

		public int ProductId { get; set; }

		public Product Product { get; set; }

		public int Quantity { get; set; }

		public double AmountAvailable { get; set; }

		public int Size { get; set; }

		public string Units { get; set; }

		public string UserId { get; set; }

		public DateTime DateAdded { get; set; }
	}
}