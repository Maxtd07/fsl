using Microsoft.EntityFrameworkCore;
using SoccerDreamFermana.Backend.Models;

namespace SoccerDreamFermana.Backend.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Donation> Donations => Set<Donation>();
    public DbSet<Member> Members => Set<Member>();
    public DbSet<Photo> Photos => Set<Photo>();

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        StampCreatedAt();
        return base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(user => user.Id);
            entity.Property(user => user.Id).HasColumnName("id");
            entity.Property(user => user.Nome).HasColumnName("nome").HasMaxLength(120).IsRequired();
            entity.Property(user => user.Email).HasColumnName("email").HasMaxLength(160).IsRequired();
            entity.Property(user => user.Password).HasColumnName("password").HasColumnType("longtext").IsRequired();
            entity.Property(user => user.Ruolo)
                .HasColumnName("ruolo")
                .HasMaxLength(20)
                .HasConversion<string>()
                .IsRequired();
            entity.Property(user => user.CreatedAt).HasColumnName("created_at").IsRequired();
            entity.HasIndex(user => user.Email).HasDatabaseName("idx_users_email");
            entity.HasIndex(user => user.Email).IsUnique().HasDatabaseName("uk_users_email");
            entity.HasIndex(user => user.CreatedAt).HasDatabaseName("idx_users_created_at");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.ToTable("events");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Id).HasColumnName("id");
            entity.Property(item => item.Titolo).HasColumnName("titolo").HasMaxLength(180).IsRequired();
            entity.Property(item => item.Tipo).HasColumnName("tipo").HasMaxLength(40);
            entity.Property(item => item.Descrizione).HasColumnName("descrizione").HasMaxLength(3000).IsRequired();
            entity.Property(item => item.Data).HasColumnName("data_evento").IsRequired();
            entity.Property(item => item.DataFine).HasColumnName("data_fine");
            entity.Property(item => item.Luogo).HasColumnName("luogo").HasMaxLength(240).IsRequired();
            entity.Property(item => item.MaxPartecipanti).HasColumnName("max_partecipanti").IsRequired();
            entity.Property(item => item.UnlimitedCapacity).HasColumnName("unlimited_capacity").IsRequired();
            entity.Property(item => item.Volantino).HasColumnName("volantino").HasColumnType("longtext");
            entity.Property(item => item.CreatedAt).HasColumnName("created_at").IsRequired();
            entity.HasIndex(item => item.Data).HasDatabaseName("idx_events_data_evento");
            entity.HasIndex(item => item.CreatedAt).HasDatabaseName("idx_events_created_at");
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.ToTable("bookings");
            entity.HasKey(booking => booking.Id);
            entity.Property(booking => booking.Id).HasColumnName("id");
            entity.Property(booking => booking.UserId).HasColumnName("user_id").IsRequired();
            entity.Property(booking => booking.EventId).HasColumnName("event_id").IsRequired();
            entity.Property(booking => booking.CreatedAt).HasColumnName("created_at").IsRequired();
            entity.Property(booking => booking.ReminderSentAt).HasColumnName("reminder_sent_at");
            entity.HasOne(booking => booking.User)
                .WithMany(user => user.Bookings)
                .HasForeignKey(booking => booking.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(booking => booking.Event)
                .WithMany(item => item.Bookings)
                .HasForeignKey(booking => booking.EventId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(booking => new { booking.UserId, booking.EventId })
                .IsUnique()
                .HasDatabaseName("uk_booking_user_event");
            entity.HasIndex(booking => booking.UserId).HasDatabaseName("idx_bookings_user_id");
            entity.HasIndex(booking => booking.EventId).HasDatabaseName("idx_bookings_event_id");
            entity.HasIndex(booking => booking.CreatedAt).HasDatabaseName("idx_bookings_created_at");
            entity.HasIndex(booking => booking.ReminderSentAt).HasDatabaseName("idx_bookings_reminder_sent_at");
        });

        modelBuilder.Entity<Member>(entity =>
        {
            entity.ToTable("members");
            entity.HasKey(member => member.Id);
            entity.Property(member => member.Id).HasColumnName("id");
            entity.Property(member => member.Name).HasColumnName("name").HasMaxLength(180).IsRequired();
            entity.Property(member => member.Role).HasColumnName("role").HasMaxLength(180).IsRequired();
            entity.Property(member => member.Position).HasColumnName("position").HasMaxLength(40);
            entity.Property(member => member.ShirtNumber).HasColumnName("shirt_number");
            entity.Property(member => member.ImageUrl).HasColumnName("image_url").HasColumnType("longtext");
            entity.Property(member => member.CreatedAt).HasColumnName("created_at").IsRequired();
            entity.HasIndex(member => member.Name).HasDatabaseName("idx_members_name");
            entity.HasIndex(member => member.Role).HasDatabaseName("idx_members_role");
            entity.HasIndex(member => member.CreatedAt).HasDatabaseName("idx_members_created_at");
            entity.HasIndex(member => member.ShirtNumber).IsUnique().HasDatabaseName("uk_members_shirt_number");
        });

        modelBuilder.Entity<Donation>(entity =>
        {
            entity.ToTable("donations");
            entity.HasKey(donation => donation.Id);
            entity.Property(donation => donation.Id).HasColumnName("id");
            entity.Property(donation => donation.Nome).HasColumnName("nome").HasMaxLength(120).IsRequired();
            entity.Property(donation => donation.Email).HasColumnName("email").HasMaxLength(160).IsRequired();
            entity.Property(donation => donation.Importo).HasColumnName("importo").IsRequired();
            entity.Property(donation => donation.PaypalOrderId).HasColumnName("paypal_order_id").HasMaxLength(80);
            entity.Property(donation => donation.PayerId).HasColumnName("payer_id").HasMaxLength(80);
            entity.Property(donation => donation.CaptureId).HasColumnName("capture_id").HasMaxLength(80);
            entity.Property(donation => donation.PaymentStatus).HasColumnName("payment_status").HasMaxLength(40);
            entity.Property(donation => donation.CreatedAt).HasColumnName("created_at").IsRequired();
            entity.HasIndex(donation => donation.CreatedAt).HasDatabaseName("idx_donations_created_at");
            entity.HasIndex(donation => donation.PaymentStatus).HasDatabaseName("idx_donations_payment_status");
        });

        modelBuilder.Entity<Photo>(entity =>
        {
            entity.ToTable("photos");
            entity.HasKey(photo => photo.Id);
            entity.Property(photo => photo.Id).HasColumnName("id");
            entity.Property(photo => photo.Titolo).HasColumnName("titolo").HasMaxLength(180);
            entity.Property(photo => photo.Descrizione).HasColumnName("descrizione").HasMaxLength(3000);
            entity.Property(photo => photo.Immagine).HasColumnName("immagine").HasColumnType("longtext");
            entity.Property(photo => photo.CreatedAt).HasColumnName("created_at").IsRequired();
            entity.HasIndex(photo => photo.CreatedAt).HasDatabaseName("idx_photos_created_at");
        });
    }

    private void StampCreatedAt()
    {
        var now = DateTime.Now;
        foreach (var entry in ChangeTracker.Entries().Where(entry => entry.State == EntityState.Added))
        {
            var property = entry.Properties.FirstOrDefault(property => property.Metadata.Name == "CreatedAt");
            if (property is not null && property.CurrentValue is DateTime value && value == default)
            {
                property.CurrentValue = now;
            }
        }
    }
}
