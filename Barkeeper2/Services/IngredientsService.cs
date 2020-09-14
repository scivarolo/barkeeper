using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Barkeeper2.Interfaces;
using Barkeeper2.Models;
using Barkeeper2.Repositories;

namespace Barkeeper2.Services {
	public class IngredientsService : BaseService<Ingredient>, IIngredientsService {
		private readonly IIngredientsRepository _ingredientsRepository;

		public IngredientsService(IIngredientsRepository ingredientsRepository) : base(ingredientsRepository) {
			_ingredientsRepository = ingredientsRepository;
		}

		public async Task<ICollection<Ingredient>> GetIngredientsCreatedByUser(ApplicationUser User) {
			var model = await _ingredientsRepository.FindAllAsync(x => x.CreatedById == User.Id);
			return model;
		}

		public async Task<Ingredient> SaveNewIngredient(Ingredient Ingredient) {
			var exists = await _ingredientsRepository.FindAsync(i => i.Name.ToLower() == Ingredient.Name.ToLower());
			if (exists != null) {
				throw new Exception("An ingredient with that name already exists.");
			}
			return await AddNew(Ingredient);
		}
	}
}