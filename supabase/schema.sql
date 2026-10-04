-- ReadShelf Supabase database schema
-- Run this in the ReadShelf Supabase project's SQL editor after the project is created.

create table if not exists public.books (
  id text primary key,
  title text not null,
  author text not null,
  published_year integer,
  genre text not null,
  tags text[] not null default '{}',
  initials text not null,
  cover_class text not null,
  description text not null default '',
  pages integer check (pages is null or pages > 0),
  rating numeric(2,1) check (rating is null or (rating >= 0 and rating <= 5)),
  featured boolean not null default false,
  sample_paragraphs text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.user_shelf (
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null references public.books(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

create table if not exists public.reading_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null references public.books(id) on delete cascade,
  progress smallint not null default 0 check (progress between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

alter table public.books enable row level security;
alter table public.user_shelf enable row level security;
alter table public.reading_progress enable row level security;

drop policy if exists "Books are publicly readable" on public.books;
create policy "Books are publicly readable"
on public.books for select
to anon, authenticated
using (true);

drop policy if exists "Users can read their own shelf" on public.user_shelf;
create policy "Users can read their own shelf"
on public.user_shelf for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can add to their own shelf" on public.user_shelf;
create policy "Users can add to their own shelf"
on public.user_shelf for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can remove from their own shelf" on public.user_shelf;
create policy "Users can remove from their own shelf"
on public.user_shelf for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can read their own progress" on public.reading_progress;
create policy "Users can read their own progress"
on public.reading_progress for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own progress" on public.reading_progress;
create policy "Users can create their own progress"
on public.reading_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own progress" on public.reading_progress;
create policy "Users can update their own progress"
on public.reading_progress for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Least-privilege Data API grants. RLS still controls which rows are accessible.
revoke all on table public.books from anon, authenticated;
revoke all on table public.user_shelf from anon, authenticated;
revoke all on table public.reading_progress from anon, authenticated;

grant select on table public.books to anon, authenticated;
grant select, insert, delete on table public.user_shelf to authenticated;
grant select, insert, update on table public.reading_progress to authenticated;

insert into public.books
(id, title, author, published_year, genre, tags, initials, cover_class, description, pages, rating, featured, sample_paragraphs)
values
('pride-and-prejudice','Pride and Prejudice','Jane Austen',1813,'Romance',array['Classic','Romance'],'P&P','cover-pride','Elizabeth Bennet navigates family expectations, first impressions, and an unexpected relationship with the reserved Mr. Darcy.',432,4.6,true,array['It is a truth universally acknowledged that a single man in possession of a good fortune must be in want of a wife.','However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families that he is considered as the rightful property of some one or other of their daughters.']),
('great-gatsby','The Great Gatsby','F. Scott Fitzgerald',1925,'Fiction',array['Classic','Fiction'],'GG','cover-gatsby','Nick Carraway enters the glamorous world of Jay Gatsby and discovers the longing, illusion, and cost hidden beneath the parties.',180,4.3,true,array['In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since.','Whenever you feel like criticizing any one, he told me, just remember that all the people in this world haven’t had the advantages that you’ve had.']),
('frankenstein','Frankenstein','Mary Shelley',1818,'Science Fiction',array['Classic','Science Fiction'],'F','cover-frank','Victor Frankenstein’s ambition to create life leads to fear, isolation, and consequences neither creator nor creation can escape.',280,4.4,true,array['You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings.','I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.']),
('sherlock-holmes','The Adventures of Sherlock Holmes','Arthur Conan Doyle',1892,'Mystery',array['Classic','Mystery'],'SH','cover-holmes','Twelve cases showcase Sherlock Holmes’s sharp observation, logic, and ability to find meaning in details others overlook.',307,4.7,true,array['To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name.','In his eyes she eclipses and predominates the whole of her sex.']),
('alice-wonderland','Alice''s Adventures in Wonderland','Lewis Carroll',1865,'Fantasy',array['Classic','Fantasy'],'AW','cover-alice','Alice follows a White Rabbit into a strange world filled with impossible rules, unusual creatures, and unforgettable conversations.',200,4.5,false,array['Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do.','So she was considering in her own mind whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies.']),
('dracula','Dracula','Bram Stoker',1897,'Horror',array['Classic','Horror'],'D','cover-dracula','A collection of journals and letters follows the terrifying spread of Count Dracula’s influence from Transylvania to England.',418,4.4,false,array['Left Munich at 8:35 P.M., on 1st May, arriving at Vienna early next morning.','Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets.']),
('moby-dick','Moby-Dick','Herman Melville',1851,'Adventure',array['Classic','Adventure'],'MD','cover-moby','Ishmael joins the whaling ship Pequod, where Captain Ahab’s obsession with a legendary white whale takes over the voyage.',635,4.1,false,array['Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, I thought I would sail about a little and see the watery part of the world.','It is a way I have of driving off the spleen and regulating the circulation.']),
('little-women','Little Women','Louisa May Alcott',1868,'Fiction',array['Classic','Fiction'],'LW','cover-women','The four March sisters grow through ambition, disappointment, family loyalty, love, and the everyday choices that shape their lives.',449,4.6,false,array['Christmas won’t be Christmas without any presents, grumbled Jo, lying on the rug.','It’s so dreadful to be poor! sighed Meg, looking down at her old dress.'])
on conflict (id) do update set
  title = excluded.title,
  author = excluded.author,
  published_year = excluded.published_year,
  genre = excluded.genre,
  tags = excluded.tags,
  initials = excluded.initials,
  cover_class = excluded.cover_class,
  description = excluded.description,
  pages = excluded.pages,
  rating = excluded.rating,
  featured = excluded.featured,
  sample_paragraphs = excluded.sample_paragraphs;
