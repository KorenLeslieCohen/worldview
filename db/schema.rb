# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140812222654) do

  create_table "articles", force: true do |t|
    t.string   "title"
    t.text     "abstract"
    t.string   "url"
    t.string   "byline"
    t.datetime "pubdate"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
  end

  create_table "cities", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "bigger_thing"
    t.float    "lon"
    t.float    "lat"
    t.string   "country"
  end

  create_table "city_users", force: true do |t|
    t.integer  "user_id"
    t.integer  "city_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "city_users", ["city_id"], name: "index_city_users_on_city_id"
  add_index "city_users", ["user_id"], name: "index_city_users_on_user_id"

  create_table "photos", force: true do |t|
    t.string   "title"
    t.string   "url"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "link"
  end

  create_table "tweets", force: true do |t|
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "uid"
  end

  create_table "user_articles", force: true do |t|
    t.integer  "user_id"
    t.integer  "article_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_articles", ["article_id"], name: "index_user_articles_on_article_id"
  add_index "user_articles", ["user_id"], name: "index_user_articles_on_user_id"

  create_table "user_photos", force: true do |t|
    t.integer  "user_id"
    t.integer  "photo_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_photos", ["photo_id"], name: "index_user_photos_on_photo_id"
  add_index "user_photos", ["user_id"], name: "index_user_photos_on_user_id"

  create_table "user_tweets", force: true do |t|
    t.integer  "user_id"
    t.integer  "tweet_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_tweets", ["tweet_id"], name: "index_user_tweets_on_tweet_id"
  add_index "user_tweets", ["user_id"], name: "index_user_tweets_on_user_id"

  create_table "users", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "provider"
    t.string   "uid"
    t.string   "image"
  end

end
