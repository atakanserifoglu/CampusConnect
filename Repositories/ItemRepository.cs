using System;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using my_new_app.Data;

namespace my_new_app.Repositories
{
	public class ItemRepository<TEntity> : IItemRepository<TEntity> where TEntity : class
	{
        protected readonly MyApplicationDbContext _context;
		public ItemRepository(MyApplicationDbContext context)
		{
            _context = context;
		}

        public async Task<IEnumerable<TEntity>> GetFiltered(Expression<Func<TEntity, bool>> pred)
        {
            return await _context.Set<TEntity>().Where(pred).ToListAsync();
        }

        public async Task<TEntity> AddNew(TEntity entity)
        {
            await _context.Set<TEntity>().AddAsync(entity);
            await UpdateDb();
            return entity;
        }

        public async Task<IEnumerable<TEntity>> GetAll()
        {
            return await _context.Set<TEntity>().ToListAsync();
        }
        
        
        public async Task<TEntity> GetById(int id)
        {
            return (await _context.Set<TEntity>().FindAsync(id))!;
        }

        public async Task<IEnumerable<TEntity>> Remove(TEntity entity)
        {
            _context.Set<TEntity>().Remove(entity);
            await UpdateDb();
            return await _context.Set<TEntity>().ToListAsync();
        }

        public async Task UpdateDb()
        {
            await _context.SaveChangesAsync();
        }
    }
}

