using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Barkeeper2.Interfaces {
	public interface IBaseService<T> where T : class {
		/// <summary>
		/// Get All entities of Type
		/// </summary>
		/// <returns>List of all entities</returns>
		Task<ICollection<T>> GetAll ();

		/// <summary>
		/// Get one entity of Type by Id
		/// </summary>
		/// <param name="Id"></param>
		/// <returns>The request entity</returns>
		Task<T> GetById (int Id);

		/// <summary>
		/// Save new entity to database
		/// </summary>
		/// <param name="t">New entity</param>
		/// <returns>New entity</returns>
		Task<T> AddNew (T t);

		/// <summary>
		/// Update existing entity in database
		/// </summary>
		/// <param name="UpdatedItem">Entity to update</param>
		/// <param name="Id">Id of entity to update</param>
		/// <returns>Updated entity</returns>
		Task<T> Update (T UpdatedItem, int Id, string UserId);

		/// <summary>
		/// Delete an existing entity from the database
		/// </summary>
		/// <param name="t">Entity to delete</param>
		/// <returns>Id of deleted entity</returns>
		Task<int> Delete (T t, string UserId);

		/// <summary>
		/// Count number of entities of type
		/// </summary>
		/// <returns>Count</returns>
		Task<int> Count ();
	}
}