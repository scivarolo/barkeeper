using System.Collections.Generic;
using System.Threading.Tasks;
using Barkeeper2.Interfaces;
using Barkeeper2.Models;

namespace Barkeeper2.Services {
	public abstract class BaseService<T> : IBaseService<T> where T : class {
		private readonly IBaseRepository<T> _repository;

		public BaseService(IBaseRepository<T> repository) {
			_repository = repository;
		}

		public async Task<ICollection<T>> GetAll() {
			return await _repository.GetAllAsync();
		}

		public async Task<T> GetById(int Id) {
			return await _repository.GetAsync(Id);
		}

		public async Task<T> AddNew(T t) {
			return await _repository.AddAsync(t);
		}

		public async Task<T> Update(T UpdatedItem, int Id, string UserId) {
			return await _repository.UpdateAsync(UpdatedItem, Id);
		}

		public async Task<int> Delete(T t, string UserId) {
			return await _repository.DeleteAsync(t);
		}

		public async Task<int> Count() {
			return await _repository.CountAsync();
		}
	}
}