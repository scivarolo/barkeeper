using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Barkeeper2.Data;
using Barkeeper2.Interfaces;
using Barkeeper2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barkeeper2.Repositories {
	public class IngredientsRepository : BaseRepository<Ingredient>, IIngredientsRepository {
		private readonly ApplicationDbContext _context;

		public IngredientsRepository (ApplicationDbContext context) : base (context) {
			_context = context;
		}

	}
}