using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Barkeeper2.Data;
using Barkeeper2.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Barkeeper2.Repositories {
	public class BaseRepository<T> : IBaseRepository<T> where T : class {
		private readonly ApplicationDbContext _context;

		public BaseRepository(ApplicationDbContext context) {
			_context = context;
		}

		public ICollection<T> GetAll() {
			return _context.Set<T>().ToList();
		}

		public async Task<ICollection<T>> GetAllAsync() {
			return await _context.Set<T>().ToListAsync();
		}

		public T Get(int Id) {
			return _context.Set<T>().Find(Id);
		}

		public async Task<T> GetAsync(int Id) {
			return await _context.Set<T>().FindAsync(Id);
		}

		public T Find(Expression<Func<T, bool>> match) {
			return _context.Set<T>().SingleOrDefault(match);
		}

		public async Task<T> FindAsync(Expression<Func<T, bool>> match) {
			return await _context.Set<T>().SingleOrDefaultAsync(match);
		}

		public ICollection<T> FindAll(Expression<Func<T, bool>> match) {
			return _context.Set<T>().Where(match).ToList();
		}

		public async Task<ICollection<T>> FindAllAsync(Expression<Func<T, bool>> match) {
			return await _context.Set<T>().Where(match).ToListAsync();
		}

		public T Add(T t) {
			_context.Set<T>().Add(t);
			_context.SaveChanges();
			return t;
		}

		public async Task<T> AddAsync(T t) {
			_context.Set<T>().Add(t);
			await _context.SaveChangesAsync();
			return t;
		}

		public T Update(T UpdatedItem, int Id) {
			if (UpdatedItem == null)
				return null;

			T existingItem = _context.Set<T>().Find(Id);
			if (existingItem != null) {
				_context.Entry(existingItem).CurrentValues.SetValues(UpdatedItem);
				_context.SaveChanges();
			}
			return existingItem;
		}

		public async Task<T> UpdateAsync(T UpdatedItem, int Id) {
			if (UpdatedItem == null)
				return null;

			T existingItem = await _context.Set<T>().FindAsync(Id);
			if (existingItem != null) {
				_context.Entry(existingItem).CurrentValues.SetValues(UpdatedItem);
				await _context.SaveChangesAsync();
			}

			return existingItem;
		}

		public void Delete(T t) {
			_context.Set<T>().Remove(t);
			_context.SaveChanges();
		}

		public async Task<int> DeleteAsync(T t) {
			_context.Set<T>().Remove(t);
			return await _context.SaveChangesAsync();
		}

		public int Count() {
			return _context.Set<T>().Count();
		}

		public async Task<int> CountAsync() {
			return await _context.Set<T>().CountAsync();
		}
	}
}