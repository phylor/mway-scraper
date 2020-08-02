require 'mechanize'
require 'byebug'
require 'uri'
require 'json'

class MWayScraper
  def initialize(browser)
    @browser = browser
  end

  def get_page(page_number)
    @browser.get("https://m-way.ch/e-bikes/?p=#{page_number}&o=2&n=48")
  end

  def products(page_number)
    page = get_page(page_number)

    page.search('.product--box').map do |product|
      image_url = product.search('img').first['data-srcset'].split(',').last.split(' ').first
      product_url = product.search('a.product--image').first['href']
      name = product.search('a.product--title').first.text.strip

      product_scraper = MWayProduct.new(@browser, product_url)
      product_scraper.load

      {
        name: name,
        url: product_url,
        image_url: image_url,
        variants: product_scraper.variants,
        properties: product_scraper.properties
      }
    end
  rescue
    nil
  end
end

class MWayProduct
  def initialize(browser, url)
    @browser = browser
    @url = url
  end

  def load
    @page = @browser.get(@url)
  end

  def properties
    @page.search('.product--properties-label').map do |property_label|
      property = case property_label.text.strip
      when 'Akku:' then :battery
      when 'Antrieb:', 'Motor:' then :motor
      when 'Anzahl Gänge:' then :gears
      when 'Display:' then :display
      when 'Federgabel:' then :suspension
      when 'Gewicht:' then :weight
      when 'Modelljahr:' then :year
      end

      next unless property

      value = property_label.next_element.text.strip

      { property => value }
    end.compact.reduce({}, &:merge)
  end

  def variants
    size_variants = @page
      .search('p.configurator--label')
      .select { |variant| variant.text == 'Grösse:' }
      .first
      .next_element

    size_variants.search('label.configurator--radio--label').map do |variant|
      name = variant.text.strip

      size = variant.previous_element['value']
      size_uri = URI.parse(@url)
      new_query = URI.decode_www_form(size_uri.query || '') << ['group[1]', size]
      size_uri.query = URI.encode_www_form(new_query)
      size_page = @browser.get(size_uri.to_s)

      cities = size_page.search('#detail--product-availability table tr td[4]').map(&:text).map(&:strip)

      {
        name: name,
        cities: cities
      }
    end
  rescue
    nil
  end
end

browser = Mechanize.new

unless File.exists?('ebikes.json')
  scraper = MWayScraper.new(browser)

  page1 = scraper.products(1)
  page2 = scraper.products(2)

  all_products = page1.compact + page2.compact
  File.write('ebikes.json', all_products.to_json)
end
