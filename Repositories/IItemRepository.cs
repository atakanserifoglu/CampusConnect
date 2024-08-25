using System;
using System.Linq.Expressions;

namespace my_new_app.Repositories
{
	public interface IItemRepository<TEntity> where TEntity: class
	{
        Task<IEnumerable<TEntity>> GetAll();
		Task<TEntity> GetById(int id);
		
		Task<IEnumerable<TEntity>>GetFiltered(Expression<Func<TEntity, bool>> pred);

		Task<TEntity> AddNew(TEntity entity);
		Task<IEnumerable<TEntity>> Remove(TEntity entity);

		Task UpdateDb();
	}
}

